import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M232 80v96a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16M48 80v80h160V80Zm64 40l40-24v48Z"
      ></path>
    </svg>
  );
}
