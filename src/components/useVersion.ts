import useCookie from "./useCookie";
import { createContainer } from "unstated-next";
import { useState, useMemo } from "react";
import { Operation } from "swagger-schema-official";

export const VERSIONS = [
  // Shows everything
  "everything",
  // Things that work with classic programs
  "classic-only",
  // Only new programs
  "ga-only",
] as const;

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;
export type Version = ElementType<typeof VERSIONS>;

export function useVersion(): [Version, (next: Version) => void] {
  const [innerVersion, setInnerVersion] = useCookie("docs-version", "ga-only");

  // Adds validation
  const setVersion = (v: Version) => {
    // @ts-ignore
    if (!VERSIONS.includes(v)) throw new Error("Invalid version" + v);
    setInnerVersion(v);
  };

  // @ts-ignore
  if (!VERSIONS.includes(innerVersion)) {
    // Override default;
    setVersion("everything");
    return ["everything", setVersion];
  }

  return [innerVersion as Version, setVersion];
}

function useVersionContext() {
  let [version, setVersion] = useVersion();

  const versionLabel =
    version === "classic-only"
      ? "Works With Classic"
      : version === "ga-only"
      ? "No Classic"
      : "All";

  const showMethod = (method: Operation) => showTags(method.tags);

  const showTags = useMemo(() => {
    return (tags: string[]) =>
      (version === "everything" && true) ||
      (version === "ga-only" && !tags.includes("Classic Only")) ||
      (version === "classic-only" && !tags.includes("Modern Only"));
  }, [version]);

  return {
    version,
    versionLabel,
    setVersion,
    modalIsOpen: open,
    showMethod,
    showTags,
  };
}

export const VersionContext = createContainer(useVersionContext);
