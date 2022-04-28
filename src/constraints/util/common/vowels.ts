const vowels = ['a', 'e', 'i', 'o', 'u'];

export const aOrAn = (word: string) => {
	return `${vowels.includes(word[0].toLowerCase()) ? 'an' : 'a'} ${word}`;
};
