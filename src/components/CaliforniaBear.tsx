type CaliforniaBearProps = {
  className?: string;
};

/** Small monochrome walking bear. One ink fill, no flag colors. */
export default function CaliforniaBear({ className = "" }: CaliforniaBearProps) {
  return (
    <svg
      viewBox="0 0 104 66"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9 40C14 34 20 32 24 31C23 20 32 12 42 16C40 6 50 5 51 16C58 12 68 12 76 18C84 16 94 22 96 30C102 28 106 34 100 40C98 44 92 46 90 48L92 60H80L78 48H70L72 60H60L58 48C50 50 40 48 34 44L36 60H24L22 44C14 44 8 42 9 40ZM34 30a2.4 2.4 0 1 0 .1 0Z"
      />
    </svg>
  );
}
