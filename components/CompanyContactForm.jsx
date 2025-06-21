'use client';

import { useRef } from "react";

export default function CompanyContactForm() {
  const formRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    const company = form.company.value.trim();
    const contact = form.contact.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Compose the mailto link
    const mailto =
      `mailto:omsairetail3@gmail.com?subject=` +
      encodeURIComponent(`[Business Enquiry] ${subject || 'New Partnership/Vendor Request'}`) +
      `&body=` +
      encodeURIComponent(
        `Company/Brand: ${company}\nContact Name: ${contact}\nEmail: ${email}\n\nMessage:\n${message}`
      );

    // Open email client
    window.location.href = mailto;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Business enquiry form"
      autoComplete="on"
    >
      <label htmlFor="company" className="sr-only">Company / Brand Name *</label>
      <input
        id="company"
        name="company"
        type="text"
        placeholder="Company / Brand Name *"
        className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
        required
        autoComplete="organization"
      />
      <label htmlFor="contact" className="sr-only">Your Name *</label>
      <input
        id="contact"
        name="contact"
        type="text"
        placeholder="Your Name *"
        className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
        required
        autoComplete="name"
      />
      <label htmlFor="email" className="sr-only">Contact Email *</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Contact Email *"
        className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
        required
        autoComplete="email"
      />
      <label htmlFor="subject" className="sr-only">Subject (optional)</label>
      <input
        id="subject"
        name="subject"
        type="text"
        placeholder="Subject (optional)"
        className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ffcc29]"
        autoComplete="off"
      />
      <label htmlFor="message" className="sr-only">Message / Proposal *</label>
      <textarea
        id="message"
        name="message"
        rows={5}
        placeholder="Message / Proposal *"
        className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
        required
        autoComplete="off"
      ></textarea>
      <button
        type="submit"
        className="bg-[#ed3237] text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-[#ffcc29] hover:text-[#ed3237] transition mt-2 focus:outline-none focus:ring-2 focus:ring-[#ed3237]/70"
      >
        Send Enquiry
      </button>
      <div className="text-xs text-gray-400 mt-1 text-center">
        <b>Note:</b> This form will open your default email app to send your enquiry.<br />
        For urgent requests, call <a href="tel:+917417229660" className="underline text-[#ed3237]">+91 74172 29660</a>.
      </div>
    </form>
  );
}
