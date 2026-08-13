<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import { BoltIcon } from '@solar-icons/vue/linear/bolt'
import { ArrowRightIcon } from '@solar-icons/vue/linear/arrow-right'
import { BuildingsIcon } from '@solar-icons/vue/linear/buildings'
import { ChartIcon } from '@solar-icons/vue/linear/chart'
import { ChatDotsIcon } from '@solar-icons/vue/linear/chat-dots'
import { CheckCircleIcon } from '@solar-icons/vue/linear/check-circle'
import { ClipboardListIcon } from '@solar-icons/vue/linear/clipboard-list'
import { CodeSquareIcon } from '@solar-icons/vue/linear/code-square'
import { CloseCircleIcon } from '@solar-icons/vue/linear/close-circle'
import { CompassIcon } from '@solar-icons/vue/linear/compass'
import { CupStarIcon } from '@solar-icons/vue/linear/cup-star'
import { CpuIcon } from '@solar-icons/vue/linear/cpu'
import { DangerTriangleIcon } from '@solar-icons/vue/linear/danger-triangle'
import { DisketteIcon } from '@solar-icons/vue/linear/diskette'
import { DocumentTextIcon } from '@solar-icons/vue/linear/document-text'
import { FileDownloadIcon } from '@solar-icons/vue/linear/file-download'
import { FlagIcon } from '@solar-icons/vue/linear/flag'
import { FolderOpenIcon } from '@solar-icons/vue/linear/folder-open'
import { GalleryIcon } from '@solar-icons/vue/linear/gallery'
import { GlobalIcon } from '@solar-icons/vue/linear/global'
import { GraphNewUpIcon } from '@solar-icons/vue/linear/graph-new-up'
import { GraphDownIcon } from '@solar-icons/vue/linear/graph-down'
import { HandShakeIcon } from '@solar-icons/vue/linear/hand-shake'
import { InfoCircleIcon } from '@solar-icons/vue/linear/info-circle'
import { LayersIcon } from '@solar-icons/vue/linear/layers'
import { LeafIcon } from '@solar-icons/vue/linear/leaf'
import { LightbulbIcon } from '@solar-icons/vue/linear/lightbulb'
import { LinkRoundIcon } from '@solar-icons/vue/linear/link-round'
import { MagnifierIcon } from '@solar-icons/vue/linear/magnifier'
import { MagicWandIcon } from '@solar-icons/vue/linear/magic-wand'
import { MapIcon } from '@solar-icons/vue/linear/map'
import { NotesIcon } from '@solar-icons/vue/linear/notes'
import { PaletteIcon } from '@solar-icons/vue/linear/palette'
import { PaperclipIcon } from '@solar-icons/vue/linear/paperclip'
import { PinListIcon } from '@solar-icons/vue/linear/pin-list'
import { RocketIcon } from '@solar-icons/vue/linear/rocket'
import { SettingsIcon } from '@solar-icons/vue/linear/settings'
import { ShieldCheckIcon } from '@solar-icons/vue/linear/shield-check'
import { SpeakerIcon } from '@solar-icons/vue/linear/speaker'
import { TargetIcon } from '@solar-icons/vue/linear/target'
import { TestTubeIcon } from '@solar-icons/vue/linear/test-tube'
import { StarIcon } from '@solar-icons/vue/linear/star'
import { StopIcon } from '@solar-icons/vue/linear/stop'
import { TransferHorizontalIcon } from '@solar-icons/vue/linear/transfer-horizontal'
import { UndoLeftIcon } from '@solar-icons/vue/linear/undo-left'
import { UserIcon } from '@solar-icons/vue/linear/user'
import { WidgetIcon } from '@solar-icons/vue/linear/widget'

const icons = {
  'arrow-right': ArrowRightIcon,
  bolt: BoltIcon,
  building: BuildingsIcon,
  chart: ChartIcon,
  chat: ChatDotsIcon,
  check: CheckCircleIcon,
  clipboard: ClipboardListIcon,
  code: CodeSquareIcon,
  compass: CompassIcon,
  cpu: CpuIcon,
  cross: CloseCircleIcon,
  danger: DangerTriangleIcon,
  document: DocumentTextIcon,
  download: FileDownloadIcon,
  flag: FlagIcon,
  folder: FolderOpenIcon,
  gallery: GalleryIcon,
  global: GlobalIcon,
  graph: GraphNewUpIcon,
  'graph-down': GraphDownIcon,
  handshake: HandShakeIcon,
  info: InfoCircleIcon,
  layers: LayersIcon,
  leaf: LeafIcon,
  lightbulb: LightbulbIcon,
  link: LinkRoundIcon,
  magic: MagicWandIcon,
  magnifier: MagnifierIcon,
  map: MapIcon,
  notes: NotesIcon,
  palette: PaletteIcon,
  paperclip: PaperclipIcon,
  pin: PinListIcon,
  rocket: RocketIcon,
  settings: SettingsIcon,
  shield: ShieldCheckIcon,
  speaker: SpeakerIcon,
  storage: DisketteIcon,
  star: StarIcon,
  target: TargetIcon,
  test: TestTubeIcon,
  trophy: CupStarIcon,
  transfer: TransferHorizontalIcon,
  unchecked: StopIcon,
  undo: UndoLeftIcon,
  user: UserIcon,
  widget: WidgetIcon,
} satisfies Record<string, Component>

type IconName = keyof typeof icons

const props = withDefaults(defineProps<{
  name: IconName
  label?: string
  size?: number | string
  strokeWidth?: number | string
}>(), {
  label: undefined,
  size: '1em',
  strokeWidth: 1.7,
})

const icon = computed(() => icons[props.name])
</script>

<template>
  <component
    :is="icon"
    class="site-solar-icon"
    :size="size"
    :stroke-width="strokeWidth"
    :alt="label"
  />
</template>
