import AccountReviewCard from "@/components/account-review-card";

export default function AccountReviewsSection({ reviews }) {
  return (
    <section className="mt-10 md:mt-12">
      <h2 className="text-center text-base font-bold md:text-left md:text-2xl">
        Your Reviews
      </h2>
      <p className="mx-auto mt-1 max-w-md text-center text-sm text-muted-foreground md:mx-0 md:text-left">
        Reviews you have submitted to the club.
      </p>

      {reviews.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
          You have not submitted any reviews yet.
        </p>
      ) : (
        <div className="mt-5 flex w-full snap-x snap-mandatory snap-always gap-5 overflow-x-auto pb-2 scroll-ps-[calc(50%-min(50vw-1.5rem,17rem))] scroll-pe-[calc(50%-min(50vw-1.5rem,17rem))] [scrollbar-width:none] md:scroll-ps-0 md:scroll-pe-0 [&::-webkit-scrollbar]:hidden">
          {reviews.map((review) => (
            <AccountReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
