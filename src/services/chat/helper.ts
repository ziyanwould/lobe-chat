import { isDeprecatedEdition } from '@lobechat/const';
import { ModelProvider } from '@lobechat/model-runtime';

import { getAiInfraStoreState } from '@/store/aiInfra';
import { aiModelSelectors, aiProviderSelectors } from '@/store/aiInfra/selectors';
import { getUserStoreState, useUserStore } from '@/store/user';
import { modelConfigSelectors, modelProviderSelectors } from '@/store/user/selectors';

export const isCanUseFC = (model: string, provider: string): boolean => {
  // TODO: remove isDeprecatedEdition condition in V2.0
  if (isDeprecatedEdition) {
    return modelProviderSelectors.isModelEnabledFunctionCall(model)(getUserStoreState());
  }

  return aiModelSelectors.isModelSupportToolUse(model, provider)(getAiInfraStoreState()) || false;
};

export const isCanUseVision = (model: string, provider: string): boolean => {
  // TODO: remove isDeprecatedEdition condition in V2.0
  if (isDeprecatedEdition) {
    return modelProviderSelectors.isModelEnabledVision(model)(getUserStoreState());
  }
  return aiModelSelectors.isModelSupportVision(model, provider)(getAiInfraStoreState());
};

/**
 * TODO: we need to update this function to auto find deploymentName with provider setting config
 */
export const findDeploymentName = (model: string, provider: string) => {
  let deploymentId = model;

  // TODO: remove isDeprecatedEdition condition in V2.0
  if (isDeprecatedEdition) {
    const chatModelCards = modelProviderSelectors.getModelCardsById(ModelProvider.Azure)(
      useUserStore.getState(),
    );

    const deploymentName = chatModelCards.find((i) => i.id === model)?.deploymentName;
    if (deploymentName) deploymentId = deploymentName;
  } else {
    // find the model by id
    const modelItem = getAiInfraStoreState().enabledAiModels?.find(
      (i) => i.id === model && i.providerId === provider,
    );

    if (modelItem && modelItem.config?.deploymentName) {
      deploymentId = modelItem.config?.deploymentName;
    }
  }

  return deploymentId;
};

export const isEnableFetchOnClient = (provider: string) => {
  // TODO: remove this condition in V2.0
  if (isDeprecatedEdition) {
    return modelConfigSelectors.isProviderFetchOnClient(provider)(useUserStore.getState());
  } else {
    return aiProviderSelectors.isProviderFetchOnClient(provider)(getAiInfraStoreState());
  }
};
