import { redirect } from "next/navigation";

export default function HomePage() {
  // Redireciona para a garagem padrão do usuário (Alpha Motors)
  redirect("/alpha-motors");
}
