import { Carousel } from "./carousel"

export type TitleDescription = {
  /** Заголовок, максимум 80 символов */
  title: string

  /** Подзаголовок, максимум 80 символов */
  description: string
} & Carousel