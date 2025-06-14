import { Fragment } from "react";
import * as Icons from "lucide-react";

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon(props: IconProps) {
  const IconComponent = Icons[props.name];

  if (!IconComponent) {
    alert("Icon not found");
    return null;
  }

  return (
    <Fragment>
      {IconComponent && (
        // @ts-expect-error lucide-react types are not fully compatible with the props we are passing
        <IconComponent
          size={props.size}
          color={props.color}
          className={props.className}
        />
      )}
    </Fragment>
  );
}
