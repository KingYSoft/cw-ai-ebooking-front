<template>
  <div class="f-map-container">
    <div ref="mapContainer" class="f-map" />
  </div>
</template>

<script setup>
  import Feature from 'ol/Feature'
  import LineString from 'ol/geom/LineString'
  import Point from 'ol/geom/Point'
  import TileLayer from 'ol/layer/Tile'
  import VectorLayer from 'ol/layer/Vector'
  import Map from 'ol/Map'
  import { fromLonLat } from 'ol/proj'
  import OSM from 'ol/source/OSM'
  import VectorSource from 'ol/source/Vector'
  import { Icon, Stroke, Style } from 'ol/style'
  import View from 'ol/View'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

  const props = defineProps({
    origin: {
      type: Object,
      default: () => ({
        name: '',
        latitude: 0,
        longitude: 0
      })
    },
    destination: {
      type: Object,
      default: () => ({
        name: '',
        latitude: 0,
        longitude: 0
      })
    },
    vessel: {
      type: Object,
      default: () => ({
        name: '',
        status: '',
        speed: 0,
        heading: 0,
        imo: '',
        type: ''
      })
    }
  })

  const mapContainer = ref(null)
  let map = null
  let routeLayer = null
  let resizeObserver = null

  const initMap = async () => {
    try {
      // 确保容器已经渲染
      await nextTick()

      if (!mapContainer.value) return

      // 确保容器有明确的尺寸
      const containerWidth = mapContainer.value.offsetWidth
      const containerHeight = mapContainer.value.offsetHeight

      if (containerWidth === 0 || containerHeight === 0) {
        // 容器还没有尺寸，设置为100%宽度和高度
        mapContainer.value.style.width = '100%'
        mapContainer.value.style.height = '100%'
      }

      // 创建地图实例
      map = new Map({
        target: mapContainer.value,
        layers: [
          new TileLayer({
            source: new OSM({
              attributions: []
            })
          })
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2
        }),
        controls: []
      })

      // 初始化航线图层
      routeLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({
            color: '#ff0000',
            width: 2,
            lineDash: [5, 10]
          })
        })
      })
      map.addLayer(routeLayer)

      // 添加容器尺寸变化监听
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (map) {
            map.updateSize()
            updateRoute()
          }
        })
        resizeObserver.observe(mapContainer.value)
      }

      // 延迟一下再更新航线，确保地图已经完全初始化
      setTimeout(() => {
        updateRoute()
      }, 100)
    } catch (error) {
      console.error('地图初始化失败:', error)
    }
  }

  const updateRoute = () => {
    if (!map || !routeLayer) return

    const source = routeLayer.getSource()
    source.clear()

    // 添加起点标记
    if (props.origin.latitude !== undefined && props.origin.longitude !== undefined) {
      const originFeature = new Feature({
        geometry: new Point(
          fromLonLat([props.origin.longitude, props.origin.latitude])
        )
      })
      originFeature.setStyle(new Style({
        image: new Icon({
          src: 'https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.5/img/marker.png',
          anchor: [0.5, 1],
          scale: 0.5
        })
      }))
      source.addFeature(originFeature)
    }

    // 添加终点标记
    if (props.destination.latitude !== undefined && props.destination.longitude !== undefined) {
      const destFeature = new Feature({
        geometry: new Point(
          fromLonLat([props.destination.longitude, props.destination.latitude])
        )
      })
      destFeature.setStyle(new Style({
        image: new Icon({
          src: 'https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.5/img/marker.png',
          anchor: [0.5, 1],
          scale: 0.5
        })
      }))
      source.addFeature(destFeature)
    }

    // 绘制航线
    if (props.origin.latitude !== undefined && props.origin.longitude !== undefined && props.destination.latitude !== undefined && props.destination.longitude !== undefined) {
      const route = new Feature({
        geometry: new LineString([
          fromLonLat([props.origin.longitude, props.origin.latitude]),
          fromLonLat([props.destination.longitude, props.destination.latitude])
        ])
      })
      source.addFeature(route)

      // 添加船舶标记（在航线中间）
      const routeCoords = route.getGeometry().getCoordinates()
      const midPoint = routeCoords[Math.floor(routeCoords.length / 2)]

      const vesselFeature = new Feature({
        geometry: new Point(midPoint)
      })
      vesselFeature.setStyle(new Style({
        image: new Icon({
          src: 'https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.5/img/marker.png',
          anchor: [0.5, 1],
          scale: 0.6
        })
      }))
      source.addFeature(vesselFeature)

      // 调整地图视图以显示整个航线
      const extent = route.getGeometry().getExtent()
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000
      })
    }
  }

  // 监听属性变化
  watch(() => [props.origin, props.destination, props.vessel], () => {
    updateRoute()
  }, { deep: true })

  // 组件挂载时初始化地图
  onMounted(() => {
    // 延迟初始化，确保父组件已经渲染完成
    setTimeout(() => {
      initMap()
    }, 100)
  })

  // 组件卸载时清理
  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (map) {
      map.dispose()
    }
  })
</script>

<style scoped>
.f-map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f0f0;
}

.f-map {
  width: 100%;
  height: 100%;
}
</style>
