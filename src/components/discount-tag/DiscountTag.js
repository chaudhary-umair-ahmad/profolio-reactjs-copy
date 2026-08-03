import { Tooltip } from 'antd';
import { t } from 'i18next';
import { Tag } from '../common';

/**
 * Discount % shown beneath the discounted-price field and on the listing discount chip.
 * Discounts are constrained to 0.1%–20%, so values outside that range are clamped to `< 0.1` /
 * `> 20.0` instead of being rounded — otherwise e.g. an actual 0.0773% rounds up to a misleading
 * "0.1%" that contradicts the "must be at least 0.1%" validation. In-range values show one decimal.
 * The caller appends the trailing "%".
 */
export const formatDiscountPercentageForChip = (value) => {
  if (value == null || value === '') return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  if (n < 0.1) return '< 0.1';
  if (n > 20) return '> 20.0';
  return n.toFixed(1);
};

export const DISCOUNT_TAG_TEXT = 'rgba(36, 159, 98, 1)';
export const DISCOUNT_TAG_BG = 'rgba(233, 247, 240, 1)';
const RIYAL_SYMBOL_CLASS = 'currency-Saudi_Riyal_Symbol';
const TOOLTIP_VALUE_COLOR = 'rgba(34, 34, 34, 1)';

const tipStyle = {
  background: '#fff',
  borderRadius: 10,
  width: 115,
  height: 49,
  boxSizing: 'border-box',
  padding: '7px 12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  alignItems: 'center',
};

const tagShellStyle = {
  display: 'inline-flex',
  maxWidth: '100%',
};

const tagStyle = {
  '--tag-color': DISCOUNT_TAG_TEXT,
  '--tag-bg': DISCOUNT_TAG_BG,
  minHeight: 20,
  maxWidth: 200,
  boxSizing: 'border-box',
  padding: '3px 8px',
  borderRadius: 4,
  border: 'none',
  opacity: 1,
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tagLabelRowStyle = {
  fontSize: 10,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  color: DISCOUNT_TAG_TEXT,
};

const tagPercentageStyle = {
  fontWeight: 800,
};

const tagOffSuffixStyle = {
  fontWeight: 600,
};

const DiscountTag = ({ discount_percentage, actualPriceDisplay = '-' }) => (
  <Tooltip
    placement="top"
    color="#fff"
    overlayInnerStyle={tipStyle}
    title={
      <div
        style={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          width: '100%',
        }}
      >
        <div style={{ color: '#666', fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{t('Actual Price')}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: TOOLTIP_VALUE_COLOR,
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          <span
            className={RIYAL_SYMBOL_CLASS}
            style={{ color: TOOLTIP_VALUE_COLOR, fontSize: 14, lineHeight: 1 }}
            aria-hidden
          />
          {actualPriceDisplay}
        </div>
      </div>
    }
  >
    <span style={tagShellStyle}>
      <Tag style={tagStyle}>
        <span style={tagLabelRowStyle}>
          <span style={tagPercentageStyle}>
            <span dir="ltr">{formatDiscountPercentageForChip(discount_percentage)}%</span>
          </span>
          <span style={tagOffSuffixStyle}>{t('Off')}</span>
        </span>
      </Tag>
    </span>
  </Tooltip>
);

export default DiscountTag;
