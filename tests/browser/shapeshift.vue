<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { s } from '../../src';

const textElement = ref<HTMLDivElement | null>(null);

onMounted(() => {
	if (textElement.value) {
		textElement.value.innerHTML = s.string().parse('Hello');
	}
});
</script>

<template>
	<div data-testid="text-element" ref="textElement">World</div>
</template>
