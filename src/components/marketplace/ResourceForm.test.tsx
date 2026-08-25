import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResourceForm from './ResourceForm';

const { createResource } = vi.hoisted(() => ({
  createResource: vi.fn<(...a: unknown[]) => Promise<string>>(),
}));

vi.mock('../../lib/marketplace/resources', () => ({
  createResource,
  getResource: vi.fn(async () => null),
  updateResource: vi.fn(async () => undefined),
  // Mirror the real subject+grade naming so the form's chip preview is exercised.
  previewUploadNames: (files: File[], subject: string, grade: string, taken: string[]) => {
    const label = `${subject} ${grade}`.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
    const base = label ? `${label} - HighScores` : 'HighScores';
    const used = new Set(taken.map(n => n.toLowerCase()));
    return files.map(f => {
      const dot = f.name.lastIndexOf('.');
      const ext = dot > 0 ? f.name.slice(dot + 1).toLowerCase() : '';
      let n = 1;
      let name = ext ? `${base}.${ext}` : base;
      while (used.has(name.toLowerCase())) { n += 1; name = ext ? `${base} ${n}.${ext}` : `${base} ${n}`; }
      used.add(name.toLowerCase());
      return name;
    });
  },
}));

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) =>
    sel({ sellerId: 'seller1', seller: { displayName: 'Ms Jane' } }),
}));

function renderNew() {
  return render(
    <MemoryRouter initialEntries={['/seller/resources/new']}>
      <Routes>
        <Route path="/seller/resources/new" element={<ResourceForm />} />
        <Route path="/seller/resources" element={<div>LIST</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillRequired() {
  await userEvent.type(screen.getByLabelText(/title/i), 'Fractions Pack');
  await userEvent.selectOptions(screen.getByLabelText(/level/i), 'middle_school');
  await userEvent.selectOptions(screen.getByLabelText(/grade/i), 'Grade 5');
  await userEvent.selectOptions(screen.getByLabelText(/subject/i), 'Mathematics');
  const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });
  await userEvent.upload(screen.getByLabelText(/files/i), file);
}

beforeEach(() => createResource.mockClear());

describe('ResourceForm (create)', () => {
  it('blocks submit until required fields + a file are present', async () => {
    renderNew();
    await userEvent.click(screen.getByRole('button', { name: /^publish$/i }));
    expect(createResource).not.toHaveBeenCalled();
    expect(screen.getByText(/add at least one file/i)).toBeInTheDocument();
  });

  it('changing level filters grade options', async () => {
    renderNew();
    await userEvent.selectOptions(screen.getByLabelText(/level/i), 'senior_school');
    expect(screen.queryByRole('option', { name: 'Grade 5' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Grade 11' })).toBeInTheDocument();
  });

  it('submits a published resource', async () => {
    renderNew();
    await fillRequired();
    await userEvent.click(screen.getByRole('button', { name: /^publish$/i }));
    await waitFor(() => expect(createResource).toHaveBeenCalledTimes(1));
    const [sellerId, sellerName, input] = createResource.mock.calls[0];
    expect(sellerId).toBe('seller1');
    expect(sellerName).toBe('Ms Jane');
    expect(input).toMatchObject({
      title: 'Fractions Pack', level: 'middle_school',
      grade: 'Grade 5', subject: 'Mathematics', status: 'published',
    });
  });

  it('submits a draft with status draft', async () => {
    renderNew();
    await fillRequired();
    await userEvent.click(screen.getByRole('button', { name: /save draft/i }));
    await waitFor(() => expect(createResource).toHaveBeenCalledTimes(1));
    expect(createResource.mock.calls[0][2]).toMatchObject({ status: 'draft' });
  });

  it('previews the subject+grade name a picked file will be saved as', async () => {
    renderNew();
    await userEvent.selectOptions(screen.getByLabelText(/level/i), 'middle_school');
    await userEvent.selectOptions(screen.getByLabelText(/grade/i), 'Grade 5');
    await userEvent.selectOptions(screen.getByLabelText(/subject/i), 'Mathematics');
    await userEvent.upload(screen.getByLabelText(/files/i),
      new File(['x'], 'worksheet.pdf', { type: 'application/pdf' }));

    expect(await screen.findByText('Mathematics Grade 5 - HighScores.pdf')).toBeInTheDocument();
    expect(screen.getByText('from worksheet.pdf')).toBeInTheDocument();
  });

  it('accepts files dropped onto the upload zone', async () => {
    renderNew();
    await userEvent.type(screen.getByLabelText(/title/i), 'Dropped Pack');
    await userEvent.selectOptions(screen.getByLabelText(/level/i), 'middle_school');
    await userEvent.selectOptions(screen.getByLabelText(/grade/i), 'Grade 5');
    await userEvent.selectOptions(screen.getByLabelText(/subject/i), 'Mathematics');

    const file = new File(['x'], 'dropped.pdf', { type: 'application/pdf' });
    const zone = screen.getByText(/drag & drop files here/i).closest('label')!;
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });

    // The dropped file appears in the attached-files list (shown as "from <name>"
    // beneath the previewed subject+grade name).
    expect(await screen.findByText(/dropped\.pdf/)).toBeInTheDocument();

    // …and it is submitted with the resource.
    await userEvent.click(screen.getByRole('button', { name: /^publish$/i }));
    await waitFor(() => expect(createResource).toHaveBeenCalledTimes(1));
    const files = createResource.mock.calls[0][3] as File[];
    expect(files.map(f => f.name)).toContain('dropped.pdf');
  });

  it('accepts a cover image dropped onto the cover zone', async () => {
    renderNew();
    const img = new File(['x'], 'cover.png', { type: 'image/png' });
    const zone = screen.getByText(/add a cover/i).closest('label')!;
    fireEvent.drop(zone, { dataTransfer: { files: [img] } });
    expect(await screen.findByText('cover.png')).toBeInTheDocument();
  });

  it('ignores a non-image dropped onto the cover zone', async () => {
    renderNew();
    const pdf = new File(['x'], 'notes.pdf', { type: 'application/pdf' });
    const zone = screen.getByText(/add a cover/i).closest('label')!;
    fireEvent.drop(zone, { dataTransfer: { files: [pdf] } });
    // The cover prompt is still shown (the pdf was rejected as a cover).
    expect(screen.getByText(/add a cover/i)).toBeInTheDocument();
  });

});
