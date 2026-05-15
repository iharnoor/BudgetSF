import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ShareControls } from "./share-controls";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function stubClipboard(impl: ((text: string) => Promise<void>) | undefined) {
  Object.defineProperty(global.navigator, "clipboard", {
    value: impl ? { writeText: vi.fn(impl) } : undefined,
    configurable: true,
    writable: true,
  });
}

function stubExecCommand(result: boolean) {
  // happy-dom doesn't define execCommand; assign before spying.
  (document as unknown as { execCommand: () => boolean }).execCommand = () => result;
  return vi.spyOn(document, "execCommand").mockImplementation(() => result);
}

describe("ShareControls", () => {
  it("renders Copy link and Share on X affordances", () => {
    render(<ShareControls />);
    expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /share on x/i })).toBeInTheDocument();
  });

  it("Share on X link points at twitter.com/intent with the moving URL", () => {
    render(<ShareControls />);
    const link = screen.getByRole("link", { name: /share on x/i }) as HTMLAnchorElement;
    expect(link.href).toContain("twitter.com/intent/tweet");
    expect(link.href).toContain(encodeURIComponent("https://budgetsf.com/moving"));
    expect(link.target).toBe("_blank");
    expect(link.rel).toContain("noopener");
  });

  it("uses navigator.clipboard on the success path and shows Copied!", async () => {
    stubClipboard(async () => undefined);

    render(<ShareControls />);
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://budgetsf.com/moving"
      );
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    });
  });

  it("falls back to textarea + execCommand when clipboard.writeText throws", async () => {
    stubClipboard(async () => {
      throw new Error("blocked");
    });
    const execSpy = stubExecCommand(true);

    render(<ShareControls />);
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith("copy");
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    });
  });

  it("shows Try again when both paths fail", async () => {
    stubClipboard(undefined);
    stubExecCommand(false);

    render(<ShareControls />);
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });
  });
});
