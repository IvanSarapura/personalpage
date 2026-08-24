"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type InvalidEvent,
} from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionLink from "@/components/SectionLink/SectionLink";
import { sendContactMessage } from "@/app/actions/contact";
import type { Locale } from "@/data/locale";
import { getUi, type UiDict } from "@/data/ui";
import {
  CONTACT_LIMITS,
  INITIAL_CONTACT_STATE,
  type ContactActionState,
  type ContactField,
} from "@/lib/contact";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  locale: Locale;
  copy: UiDict["contact"];
  fallbackHref: string;
}

type ContactControl = HTMLInputElement | HTMLTextAreaElement;

interface SubmittedContactValues {
  name: string;
  email: string;
  message: string;
  submissionId: string;
}

function isContactControl(target: unknown): target is ContactControl {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function isContactField(name: string): name is ContactField {
  return name === "name" || name === "email" || name === "message";
}

function isControlValid(control: ContactControl, field: ContactField): boolean {
  const value = control.value.trim();

  if (field === "name") {
    return value.length >= CONTACT_LIMITS.nameMin && value.length <= CONTACT_LIMITS.nameMax;
  }
  if (field === "message") {
    return value.length >= CONTACT_LIMITS.messageMin && value.length <= CONTACT_LIMITS.messageMax;
  }
  return value.length <= CONTACT_LIMITS.emailMax && control.validity.valid;
}

export default function ContactForm({ locale, copy, fallbackHref }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const submissionIdRef = useRef<HTMLInputElement>(null);
  const submittedValuesRef = useRef<SubmittedContactValues | null>(null);
  const [visibleFieldErrors, setVisibleFieldErrors] = useState<ReadonlySet<ContactField>>(
    new Set()
  );
  async function localizedAction(previousState: ContactActionState, formData: FormData) {
    const nextState = await sendContactMessage(locale, previousState, formData);
    setVisibleFieldErrors(
      nextState.status === "validation-error"
        ? new Set(
            (Object.keys(nextState.fieldErrors ?? {}) as ContactField[]).filter(
              (field) => nextState.fieldErrors?.[field] === true
            )
          )
        : new Set()
    );
    return nextState;
  }
  const [state, formAction, isPending] = useActionState(localizedAction, INITIAL_CONTACT_STATE);

  useEffect(() => {
    if (!submissionIdRef.current) return;

    if (state.status === "success") {
      formRef.current?.reset();
      submissionIdRef.current.value = crypto.randomUUID();
      submittedValuesRef.current = null;
      return;
    }

    // React resets uncontrolled fields after a form action resolves. Restore
    // them after expected failures so visitors do not lose their message, and
    // keep the same idempotency key for a safe retry.
    const submittedValues = submittedValuesRef.current;
    const form = formRef.current;
    if (state.status !== "idle" && submittedValues && form) {
      for (const name of ["name", "email", "message"] as const) {
        const control = form.elements.namedItem(name);
        if (isContactControl(control)) control.value = submittedValues[name];
      }
      submissionIdRef.current.value = submittedValues.submissionId;
      return;
    }

    if (!submissionIdRef.current.value) {
      submissionIdRef.current.value = crypto.randomUUID();
    }
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setVisibleFieldErrors(new Set());
    const formData = new FormData(event.currentTarget);
    submittedValuesRef.current = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      submissionId: String(formData.get("submissionId") ?? ""),
    };
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    if (!isContactControl(event.target) || !isContactField(event.target.name)) return;

    const target = event.target;
    const field = target.name as ContactField;
    if (!isControlValid(target, field)) return;

    setVisibleFieldErrors((current) => {
      if (!current.has(field)) return current;
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }

  function handleBlur(event: FormEvent<HTMLFormElement>) {
    if (!isContactControl(event.target) || !isContactField(event.target.name)) return;

    const target = event.target;
    const field = target.name as ContactField;
    setVisibleFieldErrors((current) => {
      const next = new Set(current);
      if (isControlValid(target, field)) next.delete(field);
      else next.add(field);
      return next;
    });
  }

  function handleInvalid(event: InvalidEvent<HTMLFormElement>) {
    if (!isContactControl(event.target) || !isContactField(event.target.name)) return;

    const field = event.target.name as ContactField;
    setVisibleFieldErrors((current) => new Set(current).add(field));
  }

  const showStatus = state.status !== "idle";
  const isError =
    state.status === "error" ||
    state.status === "validation-error" ||
    state.status === "rate-limited";
  const statusMessage =
    state.status === "success"
      ? copy.success
      : state.status === "validation-error"
        ? copy.validationError
        : state.status === "rate-limited"
          ? copy.rateLimited
          : copy.error;
  const hasFieldError = (field: ContactField) => visibleFieldErrors.has(field);
  const nameHasError = hasFieldError("name");
  const emailHasError = hasFieldError("email");
  const messageHasError = hasFieldError("message");
  const opensInNewTabLabel = getUi(locale).caseStudy.opensInNewTab;

  return (
    <div className={styles.card}>
      <form
        ref={formRef}
        action={formAction}
        className={styles.form}
        onBlurCapture={handleBlur}
        onInputCapture={handleInput}
        onInvalidCapture={handleInvalid}
        onSubmitCapture={handleSubmit}
        aria-busy={isPending}
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
            aria-invalid={nameHasError || undefined}
            aria-errormessage={nameHasError ? "contact-name-error" : undefined}
          />
          {nameHasError && (
            <p id="contact-name-error" className={styles.fieldError} aria-live="polite">
              <CircleAlert aria-hidden="true" />
              {copy.nameError}
            </p>
          )}
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
            aria-invalid={emailHasError || undefined}
            aria-errormessage={emailHasError ? "contact-email-error" : undefined}
          />
          {emailHasError && (
            <p id="contact-email-error" className={styles.fieldError} aria-live="polite">
              <CircleAlert aria-hidden="true" />
              {copy.emailError}
            </p>
          )}
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
            aria-invalid={messageHasError || undefined}
            aria-errormessage={messageHasError ? "contact-message-error" : undefined}
          />
          {messageHasError && (
            <p id="contact-message-error" className={styles.fieldError} aria-live="polite">
              <CircleAlert aria-hidden="true" />
              {copy.messageError}
            </p>
          )}
        </div>

        <Button className={styles.submit} size="sm" type="submit" disabled={isPending}>
          {isPending && <LoaderCircle className={styles.spinner} aria-hidden="true" />}
          {isPending ? copy.submitting : copy.submit}
        </Button>

        <div className={styles.statusRegion} aria-live="polite" aria-atomic="true">
          {showStatus && (
            <div className={isError ? styles.errorStatus : styles.successStatus}>
              {isError ? <CircleAlert aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
              <div>
                <p>{statusMessage}</p>
                {state.status === "error" && (
                  <p className={styles.fallback}>
                    {copy.fallbackPrefix}{" "}
                    <SectionLink
                      href={fallbackHref}
                      external
                      opensInNewTabLabel={opensInNewTabLabel}
                      size="caption"
                    >
                      {copy.fallbackLink}
                    </SectionLink>
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
