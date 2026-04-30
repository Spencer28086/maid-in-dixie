import QuoteForm from "@/components/quote/QuoteForm";

export default function QuotePage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-[#2c2c2c]">
          Request a Quote
        </h1>
        <p className="mt-4 text-[#6b6b6b]">
          Tell us what you need, and we’ll get back to you with a custom quote.
        </p>
      </div>

      <QuoteForm />
    </section>
  );
}