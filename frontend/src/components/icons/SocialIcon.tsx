import { Linkedin, Github, Braces, Mail, ArrowUpRight } from 'lucide-react'
import type { ProfileLinkKey } from '../../data/portfolio'

/**
 * Monochrome social icons.
 *
 * LinkedIn and GitHub use the official Lucide glyphs. LeetCode has no Lucide
 * glyph, and reproducing the LeetCode trademark is not appropriate here, so a
 * neutral `Braces` code mark is used instead — consistent with the rest of the
 * icon set and honest about what it is.
 */
const ICONS: Record<ProfileLinkKey, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  leetcode: Braces,
  email: Mail,
}

export interface SocialIconProps {
  network: ProfileLinkKey
  size?: number
  className?: string
}

export function SocialIcon({ network, size = 15, className }: SocialIconProps) {
  const Icon = ICONS[network]
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden="true" />
}

export function ExternalArrow({
  size = 13,
  className,
  strokeWidth = 2,
}: {
  size?: number
  className?: string
  strokeWidth?: number
}) {
  return <ArrowUpRight size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}
