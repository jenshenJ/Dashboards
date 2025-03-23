import type { FC, PropsWithChildren } from "react";
import block from 'bem-cn-lite';

import { PageHeader } from "@/ui/components/PageHeader/PageHeader";

import './DefaultPage.scss';

const cn = block('default-page');

export type DefaultPageProps = {
    title: string;
} & PropsWithChildren;

export const DefaultPage: FC<DefaultPageProps> = ({title, children}) => {
    return (
        <div className={cn()}>
            <PageHeader title={title}/>

            {children}
        </div>
    );
}
