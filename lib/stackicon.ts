import type { ComponentType, SVGProps } from "react"
import {
  Android,
  Compose as ComposeIcon,
  Dotnet as DotnetIcon,
  Fastapi as FastapiIcon,
  Flutter as FlutterIcon,
  GitIcon,
  Graphql as GraphqlIcon,
  Mongodb as MongodbIcon,
  Mysql,
  NextjsIcon,
  Nginx as NginxIcon,
  Postgresql as PostgresqlIcon,
  Python as PythonIcon,
  Pytorch as PytorchIcon,
  Supabase as SupabaseIcon,
  TailwindIcon,
  // React/Vue/Svelte/Astro ship under an underscore alias to avoid colliding
  // with framework globals.
  _React as ReactIcon,
} from "@dev.icons/react"

import {
  CSharpIcon,
  DockerIcon,
  FirebaseIcon,
  JenkinsIcon,
  KotlinIcon,
  NodejsIcon,
  RedisIcon,
  TypescriptIcon,
} from "@/components/custom-icons"

/** Common shape for both @dev.icons components and the local custom SVGs. */
export type StackIconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>

/**
 * Each stack maps to a `@dev.icons/react` component — full-color SVG icons that
 * accept `size`, `mono`, `className`, and standard SVG props.
 *
 * Note: there is no dedicated "Kotlin Multiplatform" icon in the set, so it
 * reuses the Kotlin mark.
 */
export const MY_STACKS: Record<string, StackIconComponent> = {
  "ASP.NET Core": DotnetIcon,
  Android: Android,
  "Jetpack Compose": ComposeIcon,
  Kotlin: KotlinIcon,
  "Kotlin Multiplatform": KotlinIcon,
  "C#": CSharpIcon,
  React: ReactIcon,
  Flutter: FlutterIcon,
  "Next.js": NextjsIcon,
  Tailwind: TailwindIcon,
  TypeScript: TypescriptIcon,
  NGINX: NginxIcon,
  GraphQL: GraphqlIcon,
  MySQL: Mysql,
  PostgreSQL: PostgresqlIcon,
  Python: PythonIcon,
  "PyTorch/TIMM": PytorchIcon,
  FastAPI: FastapiIcon,
  "Node.js": NodejsIcon,
  Git: GitIcon,
  Jenkins: JenkinsIcon,
  MongoDB: MongodbIcon,
  Firebase: FirebaseIcon,
  Supabase: SupabaseIcon,
  Redis: RedisIcon,
  Docker: DockerIcon,
}

/**
 * Stacks shown in the "Tools & Technologies" section on the home page.
 * Edit this list to choose which stacks appear there (order is preserved).
 * Every entry must be a key of MY_STACKS.
 */
export const HOME_STACKS: (keyof typeof MY_STACKS)[] = [
  // Languages
  "C#",
  "TypeScript",
  "Kotlin",

  // Backend
  "ASP.NET Core",
  "Node.js",

  // Frontend
  "React",
  "Next.js",
  "Tailwind",

  // Mobile
  "Android",
  "Flutter",

  // Databases
  "MySQL",
  "PostgreSQL",
  "Redis",
  "Firebase",

  // DevOps & Infra
  "Docker",
  "NGINX",
  "Jenkins",
  "Git",
]
