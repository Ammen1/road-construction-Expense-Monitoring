import Section from "./Section";
import { smallSphere, stars ,a } from "../assets";
import Heading from "../components/Heading";
import PricingList from "./PricingList";
import { LeftLine, RightLine } from "./design/Pricing";

const Pricing = () => {
  return (
    <Section crosses className="overflow-hidden -mt-[0.1rem] dark:bg-black self-center" id="pricing">
      <div className="container relative z-2">


      <Heading
      tag="Get started with REDZM Construction"
      title="Building Dreams, One Project at a Time"
    />


        <div className="relative mb-44">
          <PricingList />
          <LeftLine />
          <RightLine />
        </div>

        <div className="flex justify-center mt-10">
          <a
            className="text-xs font-bold tracking-wider uppercase border-b font-code"
            href="/pricing"
          >
            See the full details
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Pricing;
