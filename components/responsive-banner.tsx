import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface ResponsiveBannerProps {
  mobileSrc: string | StaticImageData
  desktopSrc: string | StaticImageData
  alt: string
  href?: string
  priority?: boolean
  className?: string
  mobileAspect?: "1:1" | "4:5"
}

export function ResponsiveBanner({
  mobileSrc,
  desktopSrc,
  alt,
  href,
  priority,
  className,
  mobileAspect = "1:1",
}: ResponsiveBannerProps) {
  const mobileAspectClass = mobileAspect === "4:5" ? "aspect-[4/5]" : "aspect-square"

  const content = (
    <div className={cn("relative w-full overflow-hidden rounded-2xl", className)}>
      <div className={cn("relative w-full md:hidden", mobileAspectClass)}>
        <Image
          src={mobileSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 0px"
          className="object-cover"
          unoptimized={true}
        />
      </div>

      <div className="relative w-full hidden md:block aspect-[16/5]">
        <Image
          src={desktopSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 100vw, 0px"
          className="object-cover"
          unoptimized={true}
        />
      </div>
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} aria-label={alt} className="block">
      {content}
    </Link>
  )
}
