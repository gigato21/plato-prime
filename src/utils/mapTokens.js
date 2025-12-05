export const mapTokens = (tokens) => {
    return tokens.map((token, index) => {
        return {
            id: index++,
        subdomain: token.subDomain,
        localId: token.localId,
        clientNumber: token.clientPhone,
        tokens: {
          promptTokens: token.prompt_tokens,
          completionTokens: token.completion_tokens,
        },
        totalTokens: token.prompt_tokens + token.completion_tokens,
        status: "pending",
        }
    })
}
