import useCookie from "./useCookie";
import { createContainer } from "unstated-next";
import { useState } from "react";

export const VERSIONS = ["classic-only", "hybrid", "ga-only"] as const;

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;
export type Version = ElementType<typeof VERSIONS>;

export function useVersion(): [Version, (next: Version) => void] {
  const [innerVersion, setInnerVersion] = useCookie("docs-version", "hybrid");

  // Adds validation
  const setVersion = (v: Version) => {
    // @ts-ignore
    if (!VERSIONS.includes(v)) throw new Error("Invalid version" + v);
    setInnerVersion(v);
  };

  // @ts-ignore
  if (!VERSIONS.includes(innerVersion)) {
    // Override default;
    setVersion("hybrid");
    return ["hybrid", setVersion];
  }

  return [innerVersion as Version, setVersion];
}

function useVersionContext() {
  let [version, setVersion] = useVersion();
  let [open, setOpen] = useState<boolean>(false);

  const versionLabel =
    version === "classic-only"
      ? "Works With Classic"
      : version === "ga-only"
      ? "No Classic"
      : "All";

  return {
    version,
    versionLabel,
    setVersion,
    modalIsOpen: open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
  };
}

export const VersionContext = createContainer(useVersionContext);
