import type {FamilyPackage} from "../store/useStore.ts";
import {Crown, Star, User, Users} from "lucide-react";
import  {type ElementType} from "react";

const DICEBEAR = (seed: string) =>
  seed.startsWith('data:') || seed.startsWith('blob:') || seed.startsWith('http')
    ? seed
    : `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}&mood=happy`;

export const AVATARS = [
  'Zara','Kofi','Amara','Jabari','Nia','Kwame','Aisha','Tendai',
  'Imani','Baraka','Zawadi','Chidi','Fatuma','Seun','Adaeze','Mwangi',
];

export const avatarUrl = (a: string) => DICEBEAR(a);

export const PACKAGES: {
    id: FamilyPackage; label: string; price: string; period: string;
    icon: ElementType; color: string; popular?: boolean;
}[] = [
    { id: 'solo',   label: '1 Students',   price: 'KSh 240', period: '/month', icon: User,   color: '#10b981' },
    { id: 'trio',   label: '2 Students',  price: 'KSh 360', period: '/month', icon: Users,  color: '#3b82f6', popular: true },
    { id: 'quad',   label: '3 Students',  price: 'KSh 480', period: '/month', icon: Crown,  color: '#f59e0b' },
    { id: 'family', label: '4+ Students', price: 'KSh 1080', period: '/month', icon: Star,   color: '#a855f7' },
];