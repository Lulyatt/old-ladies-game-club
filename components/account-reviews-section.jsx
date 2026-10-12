import ClubReviewsCarousel from "@/components/club-reviews-carousel";

export default function AccountReviewsSection({ reviews, loading = false }) {
  if (loading) {
    return (
      <section className="mt-10 min-w-0 max-w-full md:mt-12">
        <h2 className="text-center text-base font-bold md:text-left md:text-2xl">
          Your Reviews
        </h2>
        <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
          Loading your reviews…
        </p>
      </section>
    );
  }

  return (
    <div className="mt-10 md:mt-12">
      <ClubReviewsCarousel
        reviews={reviews}
        title="Your Reviews"
        description="Reviews you have submitted to the club."
        emptyMessage="You have not submitted any reviews yet."
        showUsername={false}
      />
    </div>
  );
}
