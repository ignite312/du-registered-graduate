import { DEGREE_PROGRAMS } from "./constants";
import type { AcademicIdentification } from "./types";

const MIN_DEGREE_MONTHS = 12;
const MIN_YEARS_SINCE_GRADUATION = 3;

export function sessionEndYear(session: string): number | null {
  const match = session.match(/^(\d{4})-/);
  if (!match) return null;
  return Number(match[1]) + 1;
}

export function checkEligibility(
  academic: AcademicIdentification,
  asOf = new Date(),
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const program = DEGREE_PROGRAMS.find((item) => item.id === academic.degreeProgramId);

  if (!program) {
    reasons.push("The selected degree programme could not be recognised.");
  } else if (program.durationMonths < MIN_DEGREE_MONTHS) {
    reasons.push(
      `Degree programmes must be at least one year in duration. ${program.name} is ${program.durationMonths} months.`,
    );
  }

  const graduated = sessionEndYear(academic.session);
  if (graduated === null) {
    reasons.push("Academic session could not be interpreted.");
  } else {
    const years = asOf.getFullYear() - graduated;
    if (years < MIN_YEARS_SINCE_GRADUATION) {
      reasons.push(
        `Graduation must be at least ${MIN_YEARS_SINCE_GRADUATION} years ago. Session ${academic.session} is treated as graduation in ${graduated}.`,
      );
    }
  }

  return { eligible: reasons.length === 0, reasons };
}

export function programName(id: string): string {
  return DEGREE_PROGRAMS.find((item) => item.id === id)?.name ?? id;
}
