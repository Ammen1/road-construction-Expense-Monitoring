import Section from "./Section";
import Heading from "./Heading";
import { r, r1, check, r4, r3, r5, r6 } from "../assets";
import { brainwaveServices, brainwaveServicesIcons } from "../constants";
import {
  Gradient,
  VideoBar,
} from "./design/Services";

import Generating from "./Generating";

const Services = () => {
  return (
    <Section crosses >
      <div className="container">
      <Heading
        title="Next-Gen Technology for Road Construction Projects."
        text="Explore how REDZM revolutionizes the way we build roads."
      />
        <div className="relative">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="object-cover w-full h-full md:object-right"
                width={800}
                alt="Road"
                height={730}
                src={r}
              />
            </div>
            <div className="relative z-1 max-w-[17rem] ml-auto">
              <h4 className="mb-4 h4">Good Raod</h4>
              <p className="body-2 mb-[3rem] text-n-3">
                REDZM unlocks the potential of Road Constructions
              </p>
              <ul className="body-2">
                {brainwaveServices.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start py-4 border-t border-n-6"
                  >
                    <img width={24} height={24} src={check} />
                    <p className="ml-4">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Generating className="absolute border left-4 right-4 bottom-4 border-n-1/10 lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2" />
          </div>
          <div className="relative grid gap-5 z-1 lg:grid-cols-2">
            <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={r6}
                  className="object-cover w-full h-full"
                  width={630}
                  height={750}
                  alt="git"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90 lg:p-15">
            <h4 className="mb-4 h4">Advanced Road Construction Management</h4>
            <p className="body-2 mb-[3rem] text-n-3">
              Revolutionize your road construction projects with our AI-powered management solution. 
              Streamline planning, execution, and monitoring effortlessly. 
              Experience the future of road infrastructure management today!
            </p>
          </div>
            </div>
            <div className="p-4 bg-n-7 rounded-3xl overflow-hidden lg:min-h-[46rem]">
              <div className="px-4 py-12 xl:px-8">
                <h4 className="mb-4 h4">Road Contructions</h4>
                <p className="body-2 mb-[2rem] text-n-3">
                  Revolutionize the way you manage road construction projects with our Best Team. 
                  From planning to execution, streamline every aspect of your construction process effortlessly. 
                  Get ready to transform the future of road infrastructure with our innovative technology.
                </p>
                <ul className="flex items-center justify-between">
                  {brainwaveServicesIcons.map((item, index) => (
                    <li
                      key={index}
                      className={`rounded-2xl flex items-center justify-center ${
                        index === 2
                          ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                          : "flex w-10 h-10 bg-n-6 md:w-15 md:h-15"
                      }`}
                    >
                      <div
                        className={
                          index === 2
                            ? "flex items-center justify-center w-full h-full bg-n-7 rounded-[1rem]"
                            : ""
                        }
                      >
                        <img src={r1} width={40} height={30} alt={item} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[25rem]">
                <img
                  src={r6}
                  className="object-cover w-full h-full"
                  width={520}
                  height={400}
                  alt="road2"
                />
                <VideoBar />
              </div>
            </div>
          </div>

          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Services;
