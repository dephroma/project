import { Keyboard, KeyboardBuilder } from "vk-io"
import { actionCarousel, TitleDescription, PhotoId } from "."

export interface Carousel {
  /**
   * Массив с кнопками — можно передать любые кнопки, которые описаны в разделе {@link https://vk.com/dev/bots_docs_3?f=4.2.+Структура+данных «Клавиатуры для ботов» → «Структура данных»}. Один элемент карусели может содержать не больше 3-х кнопок.
   *
   * ```ts
   * import { Keyboard } from "vk-io"
   *
   * Keyboard.builder()
   * .textButton({
   *    label: "text"
   * })
   * ```
   */
  buttons: KeyboardBuilder

  /**
   * Объект, описывающий действие, которое необходимо выполнить при нажатии на элемент карусели.
   *
   * Поддерживается два действия:
   *
   * - `open_link` - открыть ссылку из поля `link`.
   *
   * - `open_photo` - открыть фото текущего элемента карусели.
   */
  action?: actionCarousel
}

export type CarouselParams = TitleDescription | PhotoId