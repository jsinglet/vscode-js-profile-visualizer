/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Fragment, FunctionComponent, h } from 'preact';
import { MiddleOut } from 'vscode-js-profile-core/out/esm/client/middleOutCompression';
import { classes } from 'vscode-js-profile-core/out/esm/client/util';
import { getNodeText } from 'vscode-js-profile-core/out/esm/common/display';
import { ILocation } from 'vscode-js-profile-core/out/esm/cpu/model';
import { IHeapProfileNode } from 'vscode-js-profile-core/out/esm/heap/model';
import styles from '../common/flame-graph.css';
import { HighlightSource, IBaseTooltipProp } from '../common/types';

const clamp = (min: number, v: number, max: number) => Math.max(Math.min(v, max), min);

const makeTooltip =
  <T extends IHeapProfileNode | ILocation>(
    FunctionDetail: FunctionComponent<{ node: T }>,
  ): FunctionComponent<
    IBaseTooltipProp & {
      node: T;
    }
  > =>
  ({ left, lowerY, upperY, src, node, canvasWidth, canvasHeight }) => {
    const label = getNodeText(node);
    const above = lowerY + 300 > canvasHeight && lowerY > canvasHeight / 2;

    const file = label?.split(/\\|\//g).pop();
    return (
      <div
        className={styles.tooltip}
        aria-live="polite"
        aria-atomic={true}
        style={{
          left: clamp(0, canvasWidth * left + 10, canvasWidth - 400),
          top: above ? 'initial' : lowerY + 10,
          bottom: above ? upperY + 10 : 'initial',
        }}
      >
        <dl>
          <dt>Function</dt>
          <dd className={styles.function}>{node.callFrame.functionName}</dd>
          {label && (
            <Fragment>
              <dt>File</dt>
              <dd aria-label={file} className={classes(styles.label, node.src && styles.clickable)}>
                <MiddleOut aria-hidden={true} endChars={file?.length} text={label} />
              </dd>
            </Fragment>
          )}
          <FunctionDetail node={node}></FunctionDetail>
        </dl>
        <div className={styles.hint}>
          Ctrl+{src === HighlightSource.Keyboard ? 'Enter' : 'Click'} to jump to file
        </div>
      </div>
    );
  };

export default makeTooltip;
