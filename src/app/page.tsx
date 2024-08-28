import { HabitsList } from "@/components/home";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-[5%] py-4 w-full">
      <HabitsList />
    </main>
  );
}
