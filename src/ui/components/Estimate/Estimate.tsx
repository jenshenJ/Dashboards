import { Button, Text } from "@gravity-ui/uikit";

import block from 'bem-cn-lite';

import { sdk } from "@/sdk";
import { getEstimationColor } from "@/ui/utils/getEstimationColor";

import './Estimate.scss';

export type EstimateProps = {
    movieId: string;
    onSubmit: (estimate: string) => void,
}

const cn = block('estimate');
export const Estimate = ({movieId, onSubmit}: EstimateProps) => {

    const items = [];

    for (let i = 1; i <= 10; i++) {
        items.push((
            <Button
                key={i}
                size="l"
                onClick={async () => {
                    await sdk.estimate(movieId, String(i))
                    onSubmit(String(i));
                }}
            >
                <Text variant="header-1" color={getEstimationColor(String(i))}>{i}</Text>
            </Button>
        ))
    }

    return (
        <div className={cn()}>
            {...items}
        </div>
    )
}