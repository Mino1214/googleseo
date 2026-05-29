import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "src/app/page.tsx",
      "src/components/MediaGallery.tsx",
      "src/components/MediaCard.tsx",
      "src/app/media/page.tsx",
      "src/components/PopupNumberStrip.tsx",
    ],
    rules: {
      /** GIF·로컬 미디어는 고정 비율이 아니라 `<img>` 가 단순합니다. */
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
