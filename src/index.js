import CarouselControls from './carousel-controls';
import CarouselStateHOC from './carousel';

const Carousel = CarouselStateHOC(CarouselControls);

export { CarouselStateHOC, CarouselControls };
export default Carousel;
