import { ConverterFeature } from "@/features/converter/ConverterFeature";

export function ConverterPage() {
  return (
    <div className="relative min-h-(--content-height) overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 h-(--content-half) bg-brand" />
      <div className="absolute inset-x-0 bottom-0 h-(--content-half) bg-white" />

      <div className="relative z-10 flex min-h-(--content-height) w-full items-center justify-center px-(--page-gutter) py-12">
        <div className="w-full max-w-6xl min-w-0">
          <ConverterFeature />
        </div>
      </div>
    </div>
  );
}
