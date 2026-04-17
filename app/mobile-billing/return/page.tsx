import { MobileBillingReturnClient } from "@/components/billing/mobile-billing-return-client";

type MobileBillingReturnPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

export default async function MobileBillingReturnPage(props: MobileBillingReturnPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const params: Record<string, string> = {};

  for (const key of ["billingSuccess", "billingPlan", "session_id", "billingCanceled", "billingPortal"]) {
    const value = getString(searchParams[key]);

    if (value) {
      params[key] = value;
    }
  }

  const fallbackUrl = (() => {
    const url = new URL(
      params.billingCanceled === "1" ? "/pricing" : "/settings",
      process.env.NEXT_PUBLIC_APP_URL ?? "https://www.vaultstory.app",
    );

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  })();

  return <MobileBillingReturnClient params={params} fallbackUrl={fallbackUrl} />;
}
