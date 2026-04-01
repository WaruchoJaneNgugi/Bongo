// component/LowerPrimary.tsx
import { useState } from "react";
import type { Grade, Term, Subject, QuizResult, Screen } from "../types";

// import GradeSelectScreen from "./GradeSelectScreen";
import TermSelectScreen  from "../components/Termselectscreen";
import SubjectScreen     from "../components/SubjectScreen";
import ExamInfoScreen    from "../components/Examinfoscreen.tsx";
import QuizScreen        from "../components/QuizScreen";
import ResultsScreen     from "../components/ResultsScreen";

import "../styles/global.css";
import {useStore} from "../../../../store/useStore.ts";

export function LowerPrimary() {
    const { levelSelections, setLevelSelection } = useStore();
    const savedGrade = levelSelections.lower_primary?.grade as Grade | undefined;

    const [screen,  setScreen]  = useState<Screen>(savedGrade ? "term" : "landing");
    const [grade,   setGrade]   = useState<Grade   | null>(savedGrade ?? null);
    const [term,    setTerm]    = useState<Term    | null>(null);
    const [subject, setSubject] = useState<Subject | null>(null);
    const [result,  setResult]  = useState<QuizResult | null>(null);

    // const handleGradeContinue = (g: Grade): void => {
    //     setGrade(g);
    //     setLevelSelection('lower_primary', { grade: g });
    //     setScreen("term");
    // };

    const handleTermContinue = (t: Term): void => {
        setTerm(t);
        setScreen("subjects");
    };

    const handleSubjectSelect = (s: Subject): void => {
        setSubject(s);
        setScreen("examinfo");
    };

    const handleStartExam = (): void => setScreen("quiz");

    const handleFinish = (r: QuizResult): void => {
        setResult(r);
        setScreen("results");
    };

    const handleRetry = (): void => { setResult(null); setScreen("examinfo"); };

    const handleChangeSubject = (): void => { setSubject(null); setResult(null); setScreen("subjects"); };

    const handleChangeTerm = (): void => { setTerm(null); setSubject(null); setResult(null); setScreen("term"); };

    const handleChangeGrade = (): void => {
        setGrade(null); setTerm(null); setSubject(null); setResult(null);
        setLevelSelection('lower_primary', undefined as any);
        setScreen("landing");
    };

    return (
        <>
            {/*{screen === "landing" && <GradeSelectScreen onContinue={handleGradeContinue} />}*/}

            {screen === "term" && grade !== null && (
                <TermSelectScreen grade={grade} onContinue={handleTermContinue}  />
            )}

            {screen === "subjects" && grade !== null && term !== null && (
                <SubjectScreen grade={grade} onSubjectSelect={handleSubjectSelect} onBack={handleChangeTerm} />
            )}

            {screen === "examinfo" && grade !== null && term !== null && subject !== null && (
                <ExamInfoScreen grade={grade} term={term} subject={subject} onStart={handleStartExam} onBack={() => setScreen("subjects")} />
            )}

            {screen === "quiz" && grade !== null && term !== null && subject !== null && (
                <QuizScreen grade={grade} term={term} subject={subject} onFinish={handleFinish} onBack={() => setScreen("examinfo")} />
            )}

            {screen === "results" && grade !== null && term !== null && subject !== null && result !== null && (
                <ResultsScreen
                    grade={grade} subject={subject} result={result}
                    onRetry={handleRetry} onChangeSubject={handleChangeSubject} onChangeGrade={handleChangeGrade}
                />
            )}
        </>
    );
}
