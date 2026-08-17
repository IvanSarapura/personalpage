"use client";

import { useActionState, useEffect, useRef, type FormEvent, type InvalidEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { sendContactMessage } from "@/app/actions/contact";
import type { Locale } from "@/data/locale";
import type { UiDict } from "@/data/ui";
import { CONTACT_LIMITS, INITIAL_CONTACT_STATE } from "@/lib/contact";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  locale: Locale;
  copy: UiDict["contact"];
  fallbackHref: string;
}

type ContactControl = HTMLInputElement | HTMLTextAreaElement;

function isContactControl(target: EventTarget): target is ContactControl {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function syncValidity(target: EventTarget) {
  if (!isContactControl(target) || target.name === "website") return;
  target.setAttribute("aria-invalid", String(!target.validity.valid));
}

export default function ContactForm({ locale, copy, fallbackHref }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const submissionIdRef = useRef<HTMLInputElement>(null);
  const localizedAction = sendContactMessage.bind(null, locale);
  const [state, formAction, isPending] = useActionState(localizedAction, INITIAL_CONTACT_STATE);

  useEffect(() => {
    if (!submissionIdRef.current) return;

    if (state.status === "success") {
      formRef.current?.reset();
      submissionIdRef.current.value = crypto.randomUUID();
      return;
    }

    // Keep the same key after a transport error so a retry cannot create a
    // duplicate email if the first Resend request had an uncertain outcome.
    if (!submissionIdRef.current.value) {
      submissionIdRef.current.value = crypto.randomUUID();
    }
  }, [state.status]);

  function handleInput(event: FormEvent<HTMLFormElement>) {
    syncValidity(event.target);
  }

  function handleInvalid(event: InvalidEvent<HTMLFormElement>) {
    syncValidity(event.target);
  }

  const showStatus = state.status !== "idle";
  const isError = state.status === "error" || state.status === "validation-error";

  return (
    <div className={styles.card}>
      <form
        ref={formRef}
        action={formAction}
        className={styles.form}
        onBlurCapture={handleInput}
        onInputCapture={handleInput}
        onInvalidCapture={handleInvalid}
      >
        <input ref={submissionIdRef} type="hidden" name="submissionId" />

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">
            {copy.nameLabel}
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          </label>
          <input
            className={styles.control}
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            required
            minLength={CONTACT_LIMITS.nameMin}
            maxLength={CONTACT_LIMITS.nameMax}
            aria-invalid={state.fieldErrors?.name || undefined}
            aria-errormessage="contact-name-error"
          />
          <p
            id="contact-name-error"
            className={styles.fieldError}
            data-visible={state.fieldErrors?.name || undefined}
          >
            <CircleAlert aria-hidden="true" />
            {copy.nameError}
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">
            {copy.emailLabel}
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          </label>
          <input
            className={styles.control}
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder={copy.emailPlaceholder}
            required
            maxLength={CONTACT_LIMITS.emailMax}
            aria-invalid={state.fieldErrors?.email || undefined}
            aria-errormessage="contact-email-error"
          />
          <p
            id="contact-email-error"
            className={styles.fieldError}
            data-visible={state.fieldErrors?.email || undefined}
          >
            <CircleAlert aria-hidden="true" />
            {copy.emailError}
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">
            {copy.messageLabel}
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            className={`${styles.control} ${styles.textarea}`}
            id="contact-message"
            name="message"
            autoComplete="off"
            placeholder={copy.messagePlaceholder}
            required
            minLength={CONTACT_LIMITS.messageMin}
            maxLength={CONTACT_LIMITS.messageMax}
            rows={6}
            aria-invalid={state.fieldErrors?.message || undefined}
            aria-errormessage="contact-message-error"
          />
          <p
            id="contact-message-error"
            className={styles.fieldError}
            data-visible={state.fieldErrors?.message || undefined}
          >
            <CircleAlert aria-hidden="true" />
            {copy.messageError}
          </p>
        </div>

        <button className={styles.submit} type="submit" disabled={isPending}>
          {isPending && <LoaderCircle className={styles.spinner} aria-hidden="true" />}
          {isPending ? copy.submitting : copy.submit}
        </button>

        <div
          className={styles.statusRegion}
          aria-live={isError ? "assertive" : "polite"}
          aria-atomic="true"
        >
          {showStatus && (
            <div className={isError ? styles.errorStatus : styles.successStatus}>
              {isError ? <CircleAlert aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
              <div>
                <p>
                  {state.status === "success"
                    ? copy.success
                    : state.status === "validation-error"
                      ? copy.validationError
                      : copy.error}
                </p>
                {state.status === "error" && (
                  <p className={styles.fallback}>
                    {copy.fallbackPrefix}{" "}
                    <a href={fallbackHref} target="_blank" rel="noreferrer">
                      {copy.fallbackLink}
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
