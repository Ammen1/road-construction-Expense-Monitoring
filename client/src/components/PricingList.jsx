import { check } from "../assets";
import { pricing } from "../constants";
import { Button } from "flowbite-react";

const PricingList = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
      {pricing.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-[25rem] dark:bg-black px-6 py-8 bg-n-8 border border-n-6 rounded-lg shadow-lg"
        >
          <h4 className="mb-4 text-xl font-semibold text-n-1/25">{item.title}</h4>

          <p className="mb-6 text-n-1/50">{item.description}</p>

          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold text-n-1">{item.price}</div>
            <Button  gradientDuoTone="purpleToPink"
            outline
              type="submit"
              >
              Apply Now
            </Button>
          </div>

          <ul className="space-y-4">
            {item.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <img src={check} className="w-6 h-6 mr-3" alt="Check" />
                <p className="text-n-1/50">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
