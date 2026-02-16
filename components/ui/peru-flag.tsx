
export function PeruFlag({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3 2"
            className={className}
            {...props}
        >
            <path fill="#D91023" d="M0 0h3v2H0z" />
            <path fill="#FFF" d="M1 0h1v2H1z" />
        </svg>
    )
}
