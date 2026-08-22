import { SITE } from "@/lib/site";

const MESSAGE = "היי הגעתי מהאתר אשמח לעזרה";

export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={SITE.whatsappMessage(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלחו הודעת וואטסאפ"
    >
      <span className="wa-float-label">וואטסאפ</span>
      <span className="wa-float-icon">
        <img src="/whatsapp.svg" alt="" />
      </span>
    </a>
  );
}
