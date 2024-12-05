import NoticeTabs from "@/components/NoticeTabs";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Social Media platform for jiit</h1>
          <p className="text-muted-foreground">Stay updated with official announcements and student activities</p>
        </header>
        <NoticeTabs />
      </div>
    </main>
  );
}
