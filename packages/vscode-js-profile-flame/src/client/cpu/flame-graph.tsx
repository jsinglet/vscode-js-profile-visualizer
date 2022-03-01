/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Fragment, FunctionComponent, h } from 'preact';
import { decimalFormat } from 'vscode-js-profile-core/out/esm/cpu/display';
import { ILocation, IProfileModel } from 'vscode-js-profile-core/out/esm/cpu/model';
import makeBaseFlame from '../common/base-flame';
import makeTooltip from '../common/base-flame-tooltip';
import styles from '../common/flame-graph.css';
import StackList from '../common/stack-list';
import { IBaseInfoBoxProp, IColumn } from '../common/types';

const InfoBox: FunctionComponent<
  IBaseInfoBoxProp & {
    model: IProfileModel;
  }
> = ({ columns, boxes, box, model, setFocused }) => {
  const originalLocation = model.locations[box.loc.id];
  const localLocation = box.loc;

  return (
    <div className={styles.info}>
      <dl>
        <dt>Self Time</dt>
        <dd>{decimalFormat.format((localLocation as ILocation).selfTime / 1000)}ms</dd>
        <dt>Total Time</dt>
        <dd>{decimalFormat.format((localLocation as ILocation).aggregateTime / 1000)}ms</dd>
        <dt>
          Self Time<small>Entire Profile</small>
        </dt>
        <dd>{decimalFormat.format(originalLocation.selfTime / 1000)}ms</dd>
        <dt>
          Total Time<small>Entire Profile</small>
        </dt>
        <dd>{decimalFormat.format(originalLocation.aggregateTime / 1000)}ms</dd>
      </dl>
      <StackList box={box} columns={columns} boxes={boxes} setFocused={setFocused}></StackList>
    </div>
  );
};

export const FlameGraph: FunctionComponent<{
  columns: ReadonlyArray<IColumn>;
  filtered: ReadonlyArray<number>;
  model: IProfileModel;
}> = ({ columns, model, filtered }) => {
  const BaseFlame = makeBaseFlame<ILocation>();
  const Tooltip = makeTooltip<ILocation>(({ node }) => {
    return (
      <Fragment>
        <dt className={styles.time}>Self Time</dt>
        <dd className={styles.time}>{decimalFormat.format(node.selfTime / 1000)}ms</dd>
        <dt className={styles.time}>Aggregate Time</dt>
        <dd className={styles.time}>{decimalFormat.format(node.aggregateTime / 1000)}ms</dd>
      </Fragment>
    );
  });

  return (
    <BaseFlame
      columns={columns}
      range={model.duration}
      unit={'ms'}
      filtered={filtered}
      Tooltip={Tooltip}
      InfoBox={(props: IBaseInfoBoxProp) => <InfoBox {...props} model={model}></InfoBox>}
    ></BaseFlame>
  );
};
