import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        cusGreen: "#60956e",
        cusOrange: "#FAD77B",
        cusText: "#636363",
        cusGrayBg: "#DBDBDB",
        cusBorder: "#D4D4D4",
      },
      display: ["group-hover"],
    },
  },
  plugins: [],
};
export default config;
