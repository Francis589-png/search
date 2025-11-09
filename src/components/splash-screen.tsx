export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background perspective-800">
      <div className="text-center animate-fadeIn zoom-in">
        <div className="j-logo-container mb-4">
          <div className="j-logo">J</div>
        </div>
        <h1 className="text-3d text-3xl font-bold text-foreground">
          JTT SEARCH
        </h1>
        <p className="mt-2 text-muted-foreground">
          A search engine powered by Jusu Tech Team.
        </p>
      </div>
    </div>
  );
}
