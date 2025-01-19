export type actionCarousel =
  | {
      /** `open_link` - открыть ссылку из поля `link`. */
      type: "open_link"
      /** Ссылка */
      link: string
    }
  | {
      /** `open_photo` - открыть фото текущего элемента карусели */
      type: "open_photo"
    }