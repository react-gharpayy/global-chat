import { createFileRoute } from "@tanstack/react-router";
import GharpayyForm from "@/components/gharpayy-form";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Gharpayy - Find Your Perfect Stay in Bangalore" },
      { name: "description", content: "Find PG, flat rentals across Bangalore. Zero brokerage, personal matching in 10 minutes. Fill a 30-second form and get matched." },
    ],
  }),
});

function Index() {
  return <GharpayyForm />;
}
