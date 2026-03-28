import React from "react";
import OrganizerSectionTemplate from "./OrganizerSectionTemplate";

export default function DonationsTrackingPage() {
  return (
    <OrganizerSectionTemplate
      title="Donations Tracking"
      subtitle="Track charity income and campaign results"
      badge="Donations"
      description="Follow incoming donations by event and period, and use insights to improve charity event outcomes."
      ctaTo="/organizer/events/create-charity"
      ctaLabel="Create Charity Event"
    />
  );
}
