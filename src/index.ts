import { CarouselParams } from "./types"

export class CarouselBuilder {
  private carousel = {
    type: "carousel",
    elements: [] as Carousel[]
  }

  addElements(params: CarouselParams) {
    this.carousel.elements.push(params)
    return this
  }

  toJSON() {
    return JSON.stringify(this.carousel)
  }
}

export class Carousel {
  static builder() {
    return new CarouselBuilder()
  }
}