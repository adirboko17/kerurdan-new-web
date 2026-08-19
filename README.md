# קירור דן

אתר Next.js (App Router + TypeScript) לקירור דן — ייבוא ושיווק מקררים תעשייתיים.

## הרצה מקומית

```bash
npm install
npm run dev
```

האתר זמין בכתובת [http://localhost:3000](http://localhost:3000).

## נתיבים

- `/` דף הבית
- `/catalog` קטלוג
- `/catalog/[category]` קטגוריה
- `/product/[slug]` מוצר
- `/solutions` פתרונות לעסקים
- `/projects` פרויקטים
- `/about` אודות
- `/contact` צור קשר

מוצרים וקטגוריות מרוכזים ב-`src/lib/data.ts`.

## בנייה לפריסה

```bash
npm run build
npm start
```
