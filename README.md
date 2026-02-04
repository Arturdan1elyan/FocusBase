# TaskFlow

Սա Next.js-ով և Supabase-ով պատրաստված առաջադրանքների կառավարման պրոյեկտ է։

## Ինչպես միացնել (Setup)

1. Տեղադրել գրադարանները.
```bash
npm install


2. Ստեղծել .env.local ֆայլ և ավելացնել Supabase-ի տվյալները.

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key    

3. Միացնել պրոյեկտը.

npm run dev



Օգտագործված գրադարաններ (Dependencies)

Framework: Next.js (App Router)

Database & Auth: Supabase (@supabase/ssr, @supabase/supabase-js)

State Management: Zustand

Data Fetching: TanStack React Query (@tanstack/react-query)

Styling: Tailwind CSS



Ֆունկցիոնալ (Features)
Օգտատերերի գրանցում և մուտք (Supabase Auth)

Մուտքի ստուգում Middleware-ի միջոցով

Պրոյեկտների ստեղծում ըստ օգտատիրոջ ID-ի

Դուրս գալու հնարավորություն (Logout)



1. `git add .`
2. `git commit -m "Update README"`
3. `git push origin main`



