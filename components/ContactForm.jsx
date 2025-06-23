'use client';

import { useRef } from "react";

export default function ContactForm() {
  const formRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const mailto = `mailto:omsairetail3@gmail.com?subject=Contact from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailto;
  }

  return (
    <section
      className="max-w-xl mx-auto my-12 px-4"
      aria-labelledby="contact-heading"
    >
      <h1
        id="contact-heading"
        className="text-3xl font-bold text-[#ed3237] mb-3 text-center"
      >
        Contact Jackson Grocery Store
      </h1>
      <p className="text-gray-700 mb-7 text-center text-base max-w-lg mx-auto">
        Have a question, suggestion, or want to partner with the best grocery store in Dehradun? Fill out the form below or email us at{" "}
        <a href="mailto:omsairetail3@gmail.com" className="text-[#ed3237] hover:underline">
          omsairetail3@gmail.com
        </a>. We’ll get back to you soon!
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
        aria-label="Contact form"
        autoComplete="on"
      >
        <label htmlFor="name" className="sr-only">Your Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name *"
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
          required
          autoComplete="name"
        />

        <label htmlFor="email" className="sr-only">Your Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Your Email *"
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
          required
          autoComplete="email"
        />

        <label htmlFor="message" className="sr-only">Your Message *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Your Message *"
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-[#ed3237] text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-[#ffcc29] hover:text-[#ed3237] transition"
        >
          Send Message
        </button>

        <div className="text-xs text-gray-400 mt-2 text-center">
          <b>Note:</b> Submitting will open your default email app with your message prefilled.<br />
          For urgent support, call{" "}
          <a href="tel:+917417229660" className="underline text-[#ed3237]">
            +91 74172 29660
          </a>.
        </div>
      </form>
    </section>
  );
}
