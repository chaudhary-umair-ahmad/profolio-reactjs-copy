import * as yup from 'yup';
import tenantConstants from '@constants';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { regex } from '../../../constants/regex';

const calculatePaymentReconciliation = (parentValues) => {
  if (!parentValues.installment_available || 
      !parentValues.advance_amount?.value || 
      !parentValues.monthly_installment?.value || 
      !parentValues.no_of_installments) {
    return { isValid: true };
  }

  const propertyPrice = Math.round(Number(parentValues.price.value));
  const advanceAmount = Math.round(Number(parentValues.advance_amount.value));
  const monthlyInstallments = Math.round(Number(parentValues.monthly_installment.value) * Number(parentValues.no_of_installments));
  const balloonPayments = parentValues.balloon_payments_enabled 
    ? Math.round(Number(parentValues.amount_per_balloon_payment || 0) * Number(parentValues.num_balloon_payments || 0))
    : 0;
  const ballotingFee = parentValues.balloting_fee_enabled 
    ? Math.round(Number(parentValues.balloting_fee?.value || 0))
    : 0;
  const possessionFee = parentValues.possession_fee_enabled 
    ? Math.round(Number(parentValues.possession_fee?.value || 0))
    : 0;
  const developmentCharges = parentValues.development_fee_enabled 
    ? Math.round(Number(parentValues.development_fee?.value || 0))
    : 0;
  
  const totalPaid = advanceAmount + monthlyInstallments + balloonPayments + ballotingFee + possessionFee + developmentCharges;
  
  if (totalPaid > propertyPrice) {
    return { isValid: false, error: 'surplus', amount: totalPaid - propertyPrice };
  }
  
  if (totalPaid < propertyPrice) {
    return { isValid: false, error: 'deficit', amount: propertyPrice - totalPaid };
  }
  
  return { isValid: true };
};

export const getPostListingValidationSchema = (listing) => {
  const { t } = useTranslation();
  return yup.object().shape({
    purpose: yup.number().required(t('Please select purpose')),
    property_type: yup.number().required(t('Please select property type')),
    project: yup
      .object()
      .nullable()
      .test({
        message: t('Please select a project'),
        test: function (value) {
          if (this.parent.project_selection && !value?.id) return false;
          return true;
        },
      }),
    location_select: yup.object().shape({
      city: yup
        .object()
        .required(t(`Please select a ${tenantConstants.USER_LOCATIONS.label}`))
        .test({
          message: t(`Please select a ${tenantConstants.USER_LOCATIONS.label}`),
          test: (value) => value?.location_id,
        }),
      location: yup
        .object()
        .required(t('Please select a location'))
        .test({ message: t('Please select a location'), test: (value) => value?.location_id }),
    }),
    area: yup
      .object()
      .required(t('Please enter area and unit'))
      .test({
        message: t('Please enter valid area'),
        test: function (value) {
          if (!value?.value) return false;
          if (isNaN(Number(value?.value))) return false;
          else return true;
        },
      })
      .test({
        message: t('Please select a unit'),
        test: function (value) {
          if (!value || !value?.unit) return false;
          return true;
        },
      }),
    price: yup
      .object()
      .required(t('Please enter price'))
      .test({
        message: t('Please enter valid price'),
        test: function (value) {
          if (this.parent.purpose != 1) return true;
          if (!value?.value) return false;
          if (isNaN(Number(value?.value))) return false;
          return true;
        },
      }),
    monthly_rent: yup
      .object()
      .required(t('Please enter price'))
      .test({
        message: t('Please enter valid price'),
        test: function (value) {
          if (this.parent.purpose != 2) return true;
          if (!value?.value) return false;
          if (isNaN(Number(value?.value))) return false;
          return true;
        },
      }),
    advance_amount: yup
      .object()
      .required(t('Please enter advance amount'))
      .test({
        message: t('Please enter advance amount'),
        test: function (value, ctx) {
          if (this.parent.installment_available) {
            if (!this.parent.price.value)
              return this.createError({ message: t('Please enter total price'), path: 'advance_amount' });
            if (isNaN(Number(this.parent.price.value)))
              return this.createError({ message: t('Please enter valid price'), path: 'advance_amount' });
            if (isNaN(Number(value?.value))) return false;
            if (!value?.value)
              return this.createError({ message: t('Please enter advance amount'), path: 'advance_amount' });
            if (Number(this.parent.price.value) <= Number(value.value))
              return this.createError({
                message: t('Advance amount should be less than the total price'),
                path: 'advance_amount',
              });
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'advance_amount' });
            }
          }
          return true;
        },
      }),
    monthly_installment: yup
      .object()
      .required('Please enter monthly installment')
      .test({
        message: t('Please enter valid number'),
        test: function (value, ctx) {
          if (this.parent.installment_available) {
            if (!this.parent.price.value)
              return this.createError({ message: t('Please enter total price'), path: 'monthly_installment' });
            if (isNaN(Number(this.parent.price.value)))
              return this.createError({ message: t('Please enter valid price'), path: 'monthly_installment' });
            if (isNaN(Number(value?.value))) return false;
            if (!value?.value)
              return this.createError({ message: t('Please enter monthly installment'), path: 'monthly_installment' });
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'monthly_installment' });
            }
          }
          return true;
        },
      }),
    no_of_installments: yup
      .number()
      .typeError('Please enter a valid number')
      .test({
        message: t('Please enter no of installments'),
        test: function (value) {
          if (this.parent.installment_available) {
            if (isNaN(Number(value))) return false;
            if (!value) return false;
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'no_of_installments' });
            }
          }
          return true;
        },
      }),
    property_title: yup
      .string()
      .required(t('Please enter property title'))
      .test('contains-alpha', t('Title must contain at least one alphabetic character'), (val) =>
        regex.onlyAlphabets.test(val),
      )
      .test('len', t('Minimum of 5 characters required'), (val) => val?.length >= 5),
    property_description: yup
      .string()
      .required(t('Please enter property description'))
      .test('contains-alpha', t('Description must contain at least one alphabetic character'), (val) =>
        regex.onlyAlphabets.test(val),
      )
      .test('len', t('Minimum of 20 characters required'), (val) => val?.length >= 20),
    property_images: yup
      .array()
      .nullable()
      .test({
        message: t('Maximum 50 images can be selected'),
        test: (arr) => !!arr && arr.length < 51,
      }),
    videos: yup.array().of(
      yup
        .object()
        .nullable()
        // .test({ message: 'Title is required', test: value => value?.title })
        .test({
          message: t('Please enter a valid url'),
          test: (value) => {
            if (!value.hasOwnProperty('_destroy') || !value.hasOwnProperty('url')) {
              return /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?=.*v=([A-Za-z0-9_-]+))(?:\S+)?|embed\/([A-Za-z0-9_-]+)|v\/([A-Za-z0-9_-]+)|shorts\/([A-Za-z0-9_-]+))|youtu\.be\/([A-Za-z0-9_-]+))(?:\?.*)?$/.test(
                value?.url,
              );
            } else {
              return true;
            }
          },
        }),
    ),
    email: yup
      .string()
      .required(t('Please enter email'))
      .test('', t('Invalid email format'), function (value) {
        const isValidEmail = regex.emailRegex.test(value);
        if (!isValidEmail) {
          return false;
        }
        return true;
      }),
    landline: yup
      .string()
      .nullable()
      .test('format', t('Please enter a valid phone'), (value) => {
        if (!value) return true;
        return isValidPhoneNumber(value ? value : '-');
      }),
    mobile: yup.array().of(
      yup
        .string()
        .required(t('Please enter phone'))
        .test('format', t('Please enter a valid phone'), (value) => isValidPhoneNumber(value ? value : '-')),
    ),
    platform_selection: yup.object().test({
      message: t('Please select a platform'),
      test: function (value) {
        let isValid;
        Object.keys(value).forEach((e) => {
          if (value?.[e]?.checked) {
            isValid = true;
          }
        });
        if (isValid || !!listing) {
          return true;
        } else {
          return false;
        }
      },
    }),
    // Balloon Payment Validation
    amount_per_balloon_payment: yup
      .number()
      .typeError(t('Please enter a valid number'))
      .test({
        message: t('Please enter balloon payment amount'),
        test: function (value) {
          if (this.parent.balloon_payments_enabled) {
            if (!value) return false;
            if (isNaN(Number(value))) return false;
            
            // Reconciliation validation
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'amount_per_balloon_payment' });
            }
            
            return true;
          }
          return true;
        },
      }),
    num_balloon_payments: yup
      .number()
      .typeError(t('Please enter a valid number'))
      .test({
        message: t('Please enter number of balloon payments'),
        test: function (value) {
          if (this.parent.balloon_payments_enabled) {
            if (isNaN(Number(value))) return false;
            if (!value || value <= 0) return false;
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'num_balloon_payments' });
            }
            
            return true;
          }
          return true;
        },
      }),
    // Fee Validations
    balloting_fee: yup
      .object()
      .test({
        message: t('Please enter balloting fee amount'),
        test: function (value) {
          if (this.parent.balloting_fee_enabled) {
            if (!value?.value) return false;
            if (isNaN(Number(value?.value))) return false;
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'balloting_fee' });
            }
            
            return true;
          }
          return true;
        },
      }),
    possession_fee: yup
      .object()
      .test({
        message: t('Please enter possession fee amount'),
        test: function (value) {
          if (this.parent.possession_fee_enabled) {
            if (!value?.value) return false;
            if (isNaN(Number(value?.value))) return false;
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'possession_fee' });
            }
            
            return true;
          }
          return true;
        },
      }),
    development_fee: yup
      .object()
      .test({
        message: t('Please enter development fee amount'),
        test: function (value) {
          if (this.parent.development_fee_enabled) {
            if (!value?.value) return false;
            if (isNaN(Number(value?.value))) return false;
            
            const reconciliation = calculatePaymentReconciliation(this.parent);
            if (!reconciliation.isValid) {
              const message = reconciliation.error === 'surplus'
                ? t(`Total Payments EXCEED the Total Property Price by ${reconciliation.amount.toLocaleString()}.`)
                : t(`Total Payments are LESS than the Total Property Price by ${reconciliation.amount.toLocaleString()}.`);
              return this.createError({ message, path: 'development_fee' });
            }
            
            return true;
          }
          return true;
        },
      }),
  });
};
